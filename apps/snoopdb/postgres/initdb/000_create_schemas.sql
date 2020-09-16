     create schema conformance;
     create schema testing;

     comment on schema conformance is 'relations focused on conformance coverage and stable, conformance-eligible endpoints';
     comment on schema testing is 'relations related to our live testing environment, to test if mock tests hit desired endpoints';
