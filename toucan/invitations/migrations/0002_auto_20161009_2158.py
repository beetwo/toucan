# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-09 21:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invitations', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='toucaninvitation',
            options={'ordering': ['-pk']},
        ),
        migrations.AlterField(
            model_name='toucaninvitation',
            name='invitation_sent',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]