# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-14 13:19
from __future__ import unicode_literals

from itertools import groupby
from django.db import migrations


def remove_duplicate_memberships(apps, schema_editor):
    Membership = apps.get_model("organisations", "Membership")
    all_memberships = Membership.objects.all().order_by('user_id', 'pk').select_related('user', 'org')

    for user_id, memberships in groupby(all_memberships, lambda m: m.user_id):
        memberships = list(memberships)
        if len(memberships) > 1:
            for m in memberships[1:]:
                m.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('organisations', '0002_membership_mention_notification'),
    ]

    operations = [
        migrations.RunPython(remove_duplicate_memberships)
    ]
