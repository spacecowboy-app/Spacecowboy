Spacecowboy
===========

*Lightweight decision-making for distributed agile teams.*


What is it?
-----------

*Spacecowboy* is a tool for making quick decisions in a distributed team leveraging the *wisdom of the crowd*.  Typical use cases include effort or cost estimation, triage decisions and evaluating a proposal.  It is used together with other collaboration tools, such as a conferencing system or a work tracking system.

Playing *Spacecowboy* typically goes like this:

1. Somebody creates a place, giving it a name, and selects a card deck suitable for the type of decisions to be made.  He then shares the link to the place with the other participants.

2. All participants creates an avatar to represent them in the game.

3. The session facilitator reads the decision to be made.  All participants pick the card that best represents their vote on the decision.

4. When everybody has voted, all votes are revealed to all participants.  Maybe we have agreement at once, or maybe there needs to be some discussion about the differences in the votes.  If necessary, reset the votes and start again.

5. If there are more decisions to be made, go back to step 3.

*Spacecowboy* is always available at [https://spacecowboy.app/](https://spacecowboy.app/).  Use it as much as you can!



The repository
--------------

We are making the code available subject to the Apache 2.0 license.  See [LICENSE](LICENSE) for details.  The repository contains everything you need to start playing with *Spacecowboy* on your own.  The application consists of two main parts:

* A web-based application written in Typescript and using the React framework.

* A service component written in C# and using the .NET framework.

In its default configuration this is all you need, but especially the service can be extended in a number of ways.  By default, all state is kept in a memory based repository suitable for lightweight use and testing.  As an alternative, a Redis based repository is also provided and can be enabled with simple configuration. The service already makes metrics available in a manner directly compatible with Prometheus.

We have included a limited set of decks and charms.  You can easily add your own decks and charms by providing the necessary assets and updating the configuration.

Check the [issues](/Spacecowboy/issues) for known limitations and weaknesses.



Running locally
---------------

Building and running the service locally requires [docker](https://www.docker.com/) to be installed on your system.

Checkout everything you need with:

```bash
git clone --recurse-submodules https://github.com/spacecowboy-app/spacecowboy-app.git
```

The app and service run together as a set of docker-compose services.  To build and start the services, execute the following command from the repository root:

```bash
docker compose up --build --detatch
```

When the build completes and all containers have started, the application can be accessed by navigating to http://localhost:8000.

To stop the system again:

```bash
docker compose down
```

Let us know if you have any questions or comments.

---

© Copyright 2021-2023 Rolf Michelsen and Tami Weiss
