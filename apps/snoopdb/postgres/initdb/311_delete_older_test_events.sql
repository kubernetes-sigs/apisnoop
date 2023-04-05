begin;
create or replace function delete_older_test_events(cutoff interval)
  returns text
  language plpgsql
as $$
  declare count integer;
begin

  delete from testing.audit_event
   where ingested_at < current_timestamp - cutoff;

  get diagnostics count = ROW_COUNT;

  return count||' events removed';

end;
$$;

comment on function delete_older_test_events is 'takes INTERVAL. Deletes events in testing.audit_event older than INTERVAL. Returns success message';
commit;

select 'delete_older_test_events function defined and commented' as "build log";
