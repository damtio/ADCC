create table if not exists public.security_rate_limits (
  bucket_key text primary key,
  action text not null,
  request_count integer not null default 1 check (request_count > 0),
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.security_rate_limits enable row level security;
revoke all on table public.security_rate_limits from anon, authenticated;

create or replace function public.consume_rate_limit(
  p_bucket_key text,
  p_action text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
begin
  if p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  insert into public.security_rate_limits as limits
    (bucket_key, action, request_count, expires_at, updated_at)
  values
    (p_bucket_key, left(p_action, 80), 1, now() + make_interval(secs => p_window_seconds), now())
  on conflict (bucket_key) do update set
    action = excluded.action,
    request_count = case when limits.expires_at <= now() then 1 else limits.request_count + 1 end,
    expires_at = case when limits.expires_at <= now() then excluded.expires_at else limits.expires_at end,
    updated_at = now()
  returning request_count into current_count;

  delete from public.security_rate_limits
  where expires_at < now() - interval '1 day';

  return current_count <= p_limit;
end;
$$;

revoke all on function public.consume_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, text, integer, integer) to service_role;
