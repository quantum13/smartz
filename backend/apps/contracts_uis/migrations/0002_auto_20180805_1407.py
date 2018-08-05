# Generated by Django 2.0.3 on 2018-08-05 14:07

import apps.contracts_uis.validators
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contracts_uis', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contractui',
            name='abi',
            field=django.contrib.postgres.fields.jsonb.JSONField(blank=True, default=[], validators=[apps.contracts_uis.validators.validate_abi]),
        ),
        migrations.AddField(
            model_name='contractui',
            name='network_id',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='contractui',
            name='address',
            field=models.CharField(blank=True, default='', max_length=42),
        ),
    ]
