from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django import forms

from .models import User, UserSettings, Channel


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

class ChannelCreateForm(forms.ModelForm):
    class Meta:
        model = Channel
        fields = ("direct", "name",)
    
    def clean(self):
        cleaned_data = super().clean()

        return cleaned_data 
    
    def save(self):
        channel = super().save()
        
        return channel