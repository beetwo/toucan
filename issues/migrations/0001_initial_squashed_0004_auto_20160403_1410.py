# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-03 14:43
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    replaces = [('issues', '0001_initial'), ('issues', '0002_issue_location'), ('issues', '0003_issuecomment'), ('issues', '0004_auto_20160403_1410')]

    dependencies = [
        ('organisations', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Issue',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('title', models.CharField(max_length=300, verbose_name='issue title')),
                ('description', models.TextField()),
                ('priority', models.SmallIntegerField(choices=[(0, 'low'), (1, 'normal'), (2, 'high'), (3, 'alarm')], default=1)),
                ('visibility', models.SmallIntegerField(choices=[(0, 'private'), (1, 'all organisation members'), (2, 'all registered users'), (3, 'public')], default=3)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('organisation', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='organisations.Organisation', verbose_name='organisation')),
                ('location', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='organisations.Location', verbose_name='location')),
            ],
            options={
                'verbose_name_plural': 'issues',
                'verbose_name': 'issue',
            },
        ),
        migrations.CreateModel(
            name='IssueComment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('comment', models.TextField(blank=True, verbose_name='comment')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('issue', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='issues.Issue')),
            ],
            options={
                'verbose_name_plural': 'comments',
                'verbose_name': 'comment',
            },
        ),
        migrations.AlterModelOptions(
            name='issuecomment',
            options={'ordering': ['-created'], 'verbose_name': 'comment', 'verbose_name_plural': 'comments'},
        ),
    ]