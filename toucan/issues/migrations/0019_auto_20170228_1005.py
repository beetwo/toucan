# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-28 10:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0018_auto_20170228_0945'),
    ]

    operations = [
        migrations.AddField(
            model_name='issue',
            name='amount',
            field=models.SmallIntegerField(default=1),
        ),
        migrations.AddField(
            model_name='issue',
            name='resource',
            field=models.CharField(default='', max_length=100),
        ),
    ]
