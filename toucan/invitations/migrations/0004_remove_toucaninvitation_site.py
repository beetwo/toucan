# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-08 14:15
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('invitations', '0003_auto_20161021_0859'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='toucaninvitation',
            name='site',
        ),
    ]