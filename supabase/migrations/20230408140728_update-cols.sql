alter table "public"."games" alter column "reversedScoring" set default false;

alter table "public"."games" alter column "reversedScoring" set not null;

alter table "public"."games" alter column "scores" set default '[]'::jsonb;

alter table "public"."games" alter column "showGameRounds" set default true;

alter table "public"."games" alter column "showGameRounds" set not null;

alter table "public"."games" alter column "showInterimResults" set default true;

alter table "public"."games" alter column "showInterimResults" set not null;

alter table "public"."games" alter column "status" set default 'inprogress'::game_status;

alter table "public"."games" alter column "status" set not null;

alter table "public"."games" alter column "title" set default ''::character varying;

alter table "public"."games" alter column "title" set not null;


