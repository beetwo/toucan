# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-19 11:07
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organisations', '0002_organisation_logo'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='role',
            field=models.IntegerField(choices=[(0, 'member'), (5, 'admin'), (10, 'owner')], default=0),
        ),
    ]