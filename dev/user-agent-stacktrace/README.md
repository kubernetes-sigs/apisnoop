# user-agent-backtrace

Feeding a backtrace of function calls into the K8s audit log via the User-Agent header


## Requirements

- Patch [client-go]() to set user-agent header to backtrace using patch - <link to pull request>
- Patch [kubernetes]() to log user-agent header in the audit log - https://github.com/kubernetes/kubernetes/pull/64812


## Method

1. Gather audit-logs from Kubernetes master
```bash
nohup tail -f -n0 /var/log/kube-apiserver-audit.log 2>/dev/null > ~/audit-e2e.log &
```
2. Run program with log as argument
```bash
python user-agent-stacktrace.py <audit log>
```


## Output

```
list /api/v1/namespaces/default/pods?limit=500
    k8s.io/kubernetes/vendor/k8s.io/client-go/rest.(*Request).Do()
        _output/local/go/src/k8s.io/kubernetes/vendor/k8s.io/client-go/rest/request.go:802
    k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource.(*Helper).List()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource/helper.go:73
    k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource.(*Selector).Visit()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource/selector.go:58
    k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource.EagerVisitorList.Visit()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource/visitor.go:193
    k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource.FlattenListVisitor.Visit()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource/visitor.go:372
    k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource.DecoratedVisitor.Visit()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource/visitor.go:306
    k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource.ContinueOnErrorVisitor.Visit()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource/visitor.go:334
    k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource.(*Result).Infos()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/genericclioptions/resource/result.go:122
    k8s.io/kubernetes/pkg/kubectl/cmd/get.(*GetOptions).Run()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/cmd/get/get.go:339
    k8s.io/kubernetes/pkg/kubectl/cmd/get.NewCmdGet.func1()
        _output/local/go/src/k8s.io/kubernetes/pkg/kubectl/cmd/get/get.go:159
    k8s.io/kubernetes/vendor/github.com/spf13/cobra.(*Command).execute()
        _output/local/go/src/k8s.io/kubernetes/vendor/github.com/spf13/cobra/command.go:760
    k8s.io/kubernetes/vendor/github.com/spf13/cobra.(*Command).ExecuteC()
        _output/local/go/src/k8s.io/kubernetes/vendor/github.com/spf13/cobra/command.go:846
    k8s.io/kubernetes/vendor/github.com/spf13/cobra.(*Command).Execute()
        _output/local/go/src/k8s.io/kubernetes/vendor/github.com/spf13/cobra/command.go:794
    main.main()
        _output/local/go/src/k8s.io/kubernetes/cmd/kubectl/kubectl.go:50

```

