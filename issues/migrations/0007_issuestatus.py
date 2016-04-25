# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-20 13:19
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0006_remove_issue_location'),
    ]

    operations = [
        migrations.CreateModel(
            name='IssueStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('status', models.CharField(choices=[(('open', 'open'), [('closed', 'closed'), ('closed', 'closed')])], db_index=True, max_length=10)),
                ('status_message', models.TextField(blank=True, verbose_name='reason')),
                ('issue', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='status', to='issues.Issue')),
            ],
            options={
                'verbose_name': 'issue status',
                'get_latest_by': 'created',
                'verbose_name_plural': 'issue statuses',
            },
        ),
    ]