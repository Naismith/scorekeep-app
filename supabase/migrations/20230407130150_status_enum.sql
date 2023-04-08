create type "public"."game_status" as enum ('inprogress', 'finished');

alter table "public"."games" alter column "status" set data type game_status using "status"::game_status;

create policy "Enable ALL for users based on user_id"
on "public"."players"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



