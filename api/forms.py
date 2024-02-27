from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django import forms

from .models import User, UserSettings, Channel, Message, MessageFiles, Files

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_FILES = 4


class RegisterForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "password")

    def clean(self):
        cleaned_data = super().clean()

        cleaned_data["first_name"] = cleaned_data.get("first_name", "").capitalize()
        cleaned_data["last_name"] = cleaned_data.get("last_name", "").capitalize()
        cleaned_data["username"] = cleaned_data.get("username", "").lower()
        cleaned_data["email"] = cleaned_data.get("email", "").lower()

        try:
            validate_password(cleaned_data.get("password"))
        except ValidationError as e:
            self.add_error("password", e)

        return cleaned_data

    def save(self):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        user.save()

        UserSettings(user=user).save()
        return user


class LoginForm(forms.Form):
    login_data = forms.CharField()
    password = forms.CharField()

    def clean(self):
        cleaned_data = super().clean()

        login_data = cleaned_data.get("login_data")
        password = cleaned_data.get("password")

        try:
            email_user = User.objects.get(email=login_data)

            if email_user and email_user.check_password(password):
                user = email_user
        except User.DoesNotExist:
            user = authenticate(
                username=login_data,
                password=password,
            )

        if not user:
            raise ValidationError(_("Login or password is invalid"))

        cleaned_data["user"] = user
        return cleaned_data


class ChannelCreateForm(forms.ModelForm):
    class Meta:
        model = Channel
        fields = ("name", "members", "direct", "direct_id", "owner")

    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data.get("direct"):
            members = cleaned_data.get("members", [])

            direct_id = f"{min(members, key=lambda user: user.id).id}-{max(members, key=lambda user: user.id).id}"
            cleaned_data["direct_id"] = direct_id

            try:
                channel = Channel.objects.get(direct_id=direct_id)
                cleaned_data["channel"] = channel.repr()
                raise ValidationError("Exists")
            except Channel.DoesNotExist:
                pass

        return cleaned_data


class MessageCreateForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ("channel", "author", "content", "files")

    def clean_files(self):
        files_created = []

        if len(self.files) > MAX_FILES:
            raise ValidationError(_("Too many files"))

        for file in self.files.values():
            if file.size > MAX_FILE_SIZE:
                raise ValidationError(_("File size exceeds maximum allowed size"))

            files_created.append(file)

        return files_created

    def clean(self):
        cleaned_data = super().clean()

        try:
            cleaned_data.get("author").channels.get(id=cleaned_data.get("channel").id)
        except Channel.DoesNotExist:
            raise ValidationError(_("You are not a member of this channel"))

        return cleaned_data

    def save(self):
        files = self.cleaned_data.get("files")
        del self.cleaned_data["files"]

        message = super().save()

        for file in files:
            current = Files.objects.create(file=file.read())
            data = MessageFiles(message=message, file=current, name=file.name)
            data.save()

        return message


class PasswordChangeForm(forms.Form):
    old_password = forms.CharField(max_length=128)
    new_password1 = forms.CharField(max_length=128)
    new_password2 = forms.CharField(max_length=128)

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super().clean()

        if not self.user.check_password(cleaned_data.get("old_password")):
            self.add_error("old_password", _("Passwords is invalid"))

        if cleaned_data.get("new_password1") != cleaned_data.get("new_password2"):
            self.add_error("new_password2", _("Passwords doesn't match"))

        try:
            validate_password(cleaned_data.get("new_password1"))
        except ValidationError as e:
            self.add_error("new_password1", e)

        return cleaned_data

    def save(self):
        self.user.set_password(self.cleaned_data["new_password1"])
        self.user.save()

        return self.user
