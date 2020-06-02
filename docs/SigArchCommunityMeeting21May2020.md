- [The Ownership of Kube-up](#sec-1)
- [Platform extension mechanisms](#sec-2)
  - [The anchor points discussed in the meeting was:](#sec-2-1)
  - [Configuration possibilities discussed:](#sec-2-2)
    - [Good Staring point for configuration:](#sec-2-2-1)
    - [Secondary points to considered:](#sec-2-2-2)
  - [Factors to considered:](#sec-2-3)
  - [Three possible levels of configuration was distinguished:](#sec-2-4)
  - [One-time vs. Many-time configuration:](#sec-2-5)
  - [Possible different levels for Conformance releated to number of configurables](#sec-2-6)
  - [The way forward:](#sec-2-7)


# The Ownership of Kube-up<a id="sec-1"></a>

Ownership of Kube-up was placed on the agenda. It was not well advertised in advance, therefore it was agreed to inform the community via the mailing list to ensure that all interested parties could join the discussion.

# Platform extension mechanisms<a id="sec-2"></a>

Boundaries of platform extension mechanisms was discussed out of a mailing list tread about a recent KEP about adding a dynamic, remotely accessible platform extension for configuring the authentication chain of the kube-apiserver. In the mailing list thread several dimensions of extensibility was identified. Below is a short summery of the SIG Arch discussion.

## The anchor points discussed in the meeting was:<a id="sec-2-1"></a>

1.  How are people thinking about cluster configuration? API's vs. API is served by the Kube API server.
2.  How does a path to being included in conformance affect our thinking about whether things should be built into the Kube API server as built in API's?
3.  Is the expectation the we would require something to be in conformance and require configuration?

## Configuration possibilities discussed:<a id="sec-2-2"></a>

### Good Staring point for configuration:<a id="sec-2-2-1"></a>

-   OIDC Configuration
-   Ability to use multiple OIDC providers via tools for configuration instead of new API's

### Secondary points to considered:<a id="sec-2-2-2"></a>

-   Role-based access control
-   Auth Mechanisms / Controlling authentication stack
-   Custom resources definition
-   Certificate Signing Reqsuest
-   Dynamic Kubelet configuration

It would be possible to start slow, not through API's. It would be a good approach to see how it is used, then evaluate the use and demand.

## Factors to considered:<a id="sec-2-3"></a>

-   Dynamic configuration options should have a “use-case” with justifiable value.
-   The dynamic configuration should be a reasonable and helpful “Knob to turn” that a significant amount of people want to change at a high frequency or else must be significantly painful to change in any other way.
-   If the function can be achieved with other primitives, adding it to the API surface area isn’t required.
-   Openshift as an example of a platform which delivers additional value as a provider with a built-in auth server. Dynamic configuration can let people experiment to see how they can be used

## Three possible levels of configuration was distinguished:<a id="sec-2-4"></a>

-   Static - never change
-   Runtime soft - can change on the fly
-   Runtime hard - requires process restart

## One-time vs. Many-time configuration:<a id="sec-2-5"></a>

-   Experience show that as things are made dynamic, it result in user use-case discovery.
-   Even if the configuration is a one-time cluster operator setting it allow for better interaction.
-   It should also be considered if the options should be configurable at the cluster operator level or cloud provider level. Cluster operator rights vs. Cloud provider allowance.

## Possible different levels for Conformance releated to number of configurables<a id="sec-2-6"></a>

One way to approach the issue is through conformance levels where more or less configurables are available dependant on the "conformance level".

## The way forward:<a id="sec-2-7"></a>

The implementation of a decision tree would help to move things forward and to get consensus.
