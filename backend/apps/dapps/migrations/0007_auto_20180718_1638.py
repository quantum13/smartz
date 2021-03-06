# Generated by Django 2.0.3 on 2018-07-18 16:38

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dapps', '0006_auto_20180706_0943'),
    ]

    operations = [
        migrations.CreateModel(
            name='Log',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField()),
                ('data', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='Request',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blockchain', models.CharField(choices=[('ethereum', 'Ethereum'), ('eos', 'EOS')], default='ethereum', max_length=50)),
                ('initiator_address', models.CharField(max_length=42)),
                ('execution_datetime', models.DateTimeField()),
                ('function_name', models.CharField(max_length=255)),
                ('function_title', models.CharField(max_length=255)),
                ('function_description', models.CharField(max_length=1000)),
                ('function_arguments', django.contrib.postgres.fields.jsonb.JSONField()),
                ('result', django.contrib.postgres.fields.jsonb.JSONField()),
                ('is_success', models.BooleanField()),
                ('error', models.CharField(blank=True, max_length=255)),
                ('dapp', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='dapps.Dapp')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('blockchain', models.CharField(choices=[('ethereum', 'Ethereum'), ('eos', 'EOS')], default='ethereum', max_length=50)),
                ('tx_id', models.CharField(max_length=128)),
                ('execution_datetime', models.DateTimeField()),
                ('mining_datetime', models.DateTimeField()),
                ('initiator_address', models.CharField(max_length=42)),
                ('function_name', models.CharField(blank=True, max_length=255)),
                ('function_title', models.CharField(max_length=255)),
                ('function_description', models.CharField(max_length=1000)),
                ('function_arguments', django.contrib.postgres.fields.jsonb.JSONField()),
                ('info', django.contrib.postgres.fields.jsonb.JSONField()),
                ('is_success', models.BooleanField()),
                ('error', models.CharField(blank=True, max_length=255)),
                ('dapp', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='dapps.Dapp')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='log',
            name='tx',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='logs', to='dapps.Transaction'),
        ),
        migrations.AddIndex(
            model_name='transaction',
            index=models.Index(fields=['tx_id', 'blockchain'], name='dapps_trans_tx_id_072689_idx'),
        ),
    ]
