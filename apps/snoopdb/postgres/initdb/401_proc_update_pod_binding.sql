create procedure update_pod_binding_events()
  /*
    This is an edge case for an endpoint where it is hit consistently as part of the given test,
    but is not hit by the test useragent.  See https://github.com/cncf/apisnoop/issues/660
  ,*/
  language plpgsql as $$
  begin
update audit_event
       set test_hit = true,
           conf_test_hit = true,
           test = '[sig-node] Pods should delete a collection of pods [Conformance]'

 where endpoint = 'createCoreV1NamespacedPodBinding'
   and useragent like 'kube-scheduler%'
   and data->>'requestURI' like '/api/v1/namespaces/pods-%/pods/test-pod-%/binding';
    -- commit;
    end;
$$;

