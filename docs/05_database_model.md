# 05 — Modelo de Banco de Dados

Banco recomendado: PostgreSQL.

## 1. Convenções

- IDs como UUID.
- Datas de criação e atualização em UTC.
- Soft delete opcional apenas onde fizer sentido.
- Todas as entidades de negócio devem conter `SalonId`.

## 2. Tabelas

### salons

```text
id uuid pk
name varchar(160) not null
phone varchar(30) null
owner_name varchar(160) not null
created_at timestamptz not null
updated_at timestamptz null
```

### users

```text
id uuid pk
salon_id uuid fk salons(id)
name varchar(160) not null
email varchar(180) not null unique
password_hash text not null
created_at timestamptz not null
updated_at timestamptz null
```

### customers

```text
id uuid pk
salon_id uuid fk salons(id)
name varchar(160) not null
phone varchar(30) not null
birth_date date null
contact_preference varchar(30) not null default 'WhatsApp'
photo_url text null
notes text null
created_at timestamptz not null
updated_at timestamptz null
is_deleted boolean not null default false
```

### services

```text
id uuid pk
salon_id uuid fk salons(id)
name varchar(120) not null
suggested_return_days int not null
default_message_template text null
is_active boolean not null default true
created_at timestamptz not null
updated_at timestamptz null
```

### appointments

```text
id uuid pk
salon_id uuid fk salons(id)
customer_id uuid fk customers(id)
service_id uuid fk services(id)
appointment_date date not null
notes text null
created_at timestamptz not null
updated_at timestamptz null
```

### scheduled_messages

```text
id uuid pk
salon_id uuid fk salons(id)
customer_id uuid fk customers(id)
appointment_id uuid fk appointments(id)
send_date date not null
message text not null
status varchar(30) not null
sent_at timestamptz null
canceled_at timestamptz null
error_message text null
created_at timestamptz not null
updated_at timestamptz null
```

### message_templates

```text
id uuid pk
salon_id uuid fk salons(id)
template text not null
created_at timestamptz not null
updated_at timestamptz null
```

### notification_settings

```text
id uuid pk
salon_id uuid fk salons(id)
enabled boolean not null default true
preferred_time varchar(5) not null default '09:00'
mode varchar(40) not null default 'OnlyWhenMessagesDue'
created_at timestamptz not null
updated_at timestamptz null
```

## 3. Índices recomendados

```sql
create index ix_customers_salon_name on customers (salon_id, name);
create index ix_customers_salon_phone on customers (salon_id, phone);
create index ix_services_salon_active on services (salon_id, is_active);
create index ix_appointments_salon_date on appointments (salon_id, appointment_date desc);
create index ix_appointments_salon_customer on appointments (salon_id, customer_id);
create index ix_messages_salon_status_date on scheduled_messages (salon_id, status, send_date);
create index ix_messages_salon_customer on scheduled_messages (salon_id, customer_id);
```

## 4. Enums

### MessageStatus

```text
Pending
Sent
Canceled
Error
```

### ContactPreference

```text
WhatsApp
Phone
Sms
```

### NotificationMode

```text
OnlyWhenMessagesDue
EveryDay
Never
```

## 5. Regras de integridade

- `suggested_return_days` deve ser maior que zero.
- `phone` deve ser obrigatório em cliente.
- `status` deve aceitar apenas valores conhecidos.
- `send_date` deve ser calculado a partir do atendimento.
- Não permitir relacionamento entre entidades de salões diferentes.

## 6. Dados seed recomendados

Ao criar um salão, criar serviços iniciais opcionais:

```text
Mechas — 15 dias
Coloração — 30 dias
Corte — 45 dias
Hidratação — 15 dias
Escova — 7 dias
```

Também criar mensagem padrão geral.
