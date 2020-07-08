from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _

from .managers import CustomUserManager
# Create your models here.

class CustomUser(AbstractUser):
    class UserType(models.TextChoices):
        CLIENT = 'CL', _('Client')
        FREELANCER = 'FL', _('Freelancer')
    user_type = models.CharField(max_length=2, choices=UserType.choices, default=UserType.FREELANCER)
    objects = CustomUserManager()

    def is_client(self):
        return self.user_type == "CL"
    
    def is_freelancer(self):
        return self.user_type == "FL"