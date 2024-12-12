Table users {
  id          varchar [pk, unique, default: "cuid()"]
  email       varchar [unique]
  phone       varchar
  birthdate   datetime
  createdAt   datetime [default: "now()"]
  updatedAt   datetime [default: "updatedAt"]
  password    varchar
  fullname    varchar
  profileUrl  varchar
}

Table event_categories {
  id          varchar [pk, unique, default: "cuid()"]
  name        varchar
  createdAt   datetime [default: "now()"]
  updatedAt   datetime [default: "updatedAt"]
}

Table events {
  id          varchar [pk, unique, default: "cuid()"]
  title       varchar
  description varchar
  init        datetime
  end         datetime
  isPublic    boolean
  userId      varchar
  locationId  varchar
  categoryId  varchar
}

Table locations {
  id          varchar [pk, unique, default: "cuid()"]
  name        varchar
  latitude    float
  longitude   float
  createdAt   datetime [default: "now()"]
  userId      varchar
}

Table invites {
  id          varchar [pk, unique, default: "cuid()"]
  eventId     varchar
  userId      varchar
  message     varchar
  createdAt   datetime [default: "now()"]
  updatedAt   datetime [default: "updatedAt"]
  rejectedAt  datetime
  acceptedAt  datetime
}

Ref: events.userId > users.id
Ref: invites.userId > users.id
Ref: locations.userId > users.id
Ref: events.categoryId > event_categories.id
Ref: events.locationId > locations.id
Ref: invites.eventId > events.id

