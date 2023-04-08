alter table "public"."games" enable row level security;

alter table "public"."games_players" enable row level security;

alter table "public"."players" enable row level security;

create policy "Enable all for users based on user_id"
on "public"."games"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable all for users based on user_id"
on "public"."games_players"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



