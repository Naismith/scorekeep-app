alter table "public"."games" disable row level security;

alter table "public"."games_players" disable row level security;

alter table "public"."players" alter column "color" set not null;

alter table "public"."players" alter column "name" set not null;

alter table "public"."players" disable row level security;


