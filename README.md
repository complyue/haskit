# HaskIt - Haskell software, fast Iterations

[Haskell](https://haskell.org)
makes the wrong stuff harder to build, if not the right
things easier to form.

Programming in **Haskell**, it is actually harder, for you to progress,
before you come (back, likely at times, with your love) with a sufficient
understanding of your problem,
[in mathematical ways](https://arxiv.org/abs/1904.07968),
this is one of the reasons why **Haskell** software usually bear high
quality and the language is so great.

At times, you just can **not** gain understandings of that grade, without
trials, i.e. experiments with your data and workflows for currently
running business, that might include your users and even your suppliers.

And that normally involve some pieces of software powering the run of
your trials. With respect to programming languages, there you have plenty,
practical choices:

- boring **Haskell** for true love
- **Rust**, **C/C++** for raw machine performance
- **Python**, **Ruby** for fast iterations
- **Julia** for both above
- **Go** for collaboration between commponents
- **JavaScript** for Web technology based UI, and everything else with extra love
- many others in the mix

But why not start benefitting from **Haskell**, before you feel comfortable
to use it directly, if you have the choice?

Here is this offer:

- **HaskIt** (this package)

  Interactive workbench with easy yet powerful visualizations, for data/idea
  exploration.

- [HasDB](https://github.com/e-wrks/hasdb)

  A
  [DBMS](https://en.wikipedia.org/wiki/Database#Database_management_system)
  that manages
  [in-memory](https://en.wikipedia.org/wiki/In-memory_database)
  [Graph](https://en.wikipedia.org/wiki/Graph_database)s
  those manifesting
  [out-of-core](https://en.wikipedia.org/wiki/Out-of-core)
  [Array](https://en.wikipedia.org/wiki/Array_DBMS)s
  .

  - [HasPyC](https://github.com/e-wrks/haspyc)

    The **Python** connector to **HasDB**, to integrate with your numeric
    systems, bound to high-dimensional data (e.g. parameters of machine
    learning models, training data, time-series), modeled after
    **Entity-Relationship** as **Graph**s, i.e. entities as nodes and
    relationships as edges.

- [Sedh](https://github.com/e-wrks/sedh)

  Run jobs those need parallel computing power, with your own swarms of
  servers, all having straight access to big data living in **HasDB**
  instances, including those high-dimensional parts as efficiently shared
  ND arrays.

  Think of even easier parallelism in spirit of
  [MPI](https://www.mpi-forum.org),
  with the bonus that jobs are atomatically scheduled with respect to
  priority and headcount specification as submitted.

- [Nedh](https://github.com/e-wrks/nedh)

  Yet another abstraction of networking for
  [IPC](https://en.wikipedia.org/wiki/Inter-process_communication)
  and
  [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call)
  over network.

  Think of something like **TCP** services with **UDP** discoveries, where
  [Head-of-Line blocking](https://en.wikipedia.org/wiki/Head-of-line_blocking)
  is resolved by arbitrary number of named, concurrent command channels, with
  each channel conveying its own stream of business instructions w/ data.

- [Đ (Edh)](https://github.com/e-wrks/edh)

  An **Object** layer (or otherwise a parasitic programming language)
  powered by **Haskell** ([GHC](https://haskell.org/ghc)), especially
  [Software Transactional Memory](http://hackage.haskell.org/package/stm).
