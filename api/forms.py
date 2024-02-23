from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django import forms

from .models import User, UserSettings, Channel, ChannelUsers


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
        fields = ("direct", "name", "members", "owner")

    def clean(self):
        cleaned_data = super().clean()

        # ENSURE CHANNEL DOESN'T EXIST
        return cleaned_data

    def save(self):
        channel = super().save()
        return channel
