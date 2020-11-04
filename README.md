# HaskIt Đ - Haskell Software, Fast Iterations

> Get Quality from
> [Haskell](https://haskell.org),
> Get Bullshit Done Quickly with
> [Đ (Edh)](https://github.com/e-wrks/edh)

Undoubtedly, [Haskell](https://haskell.org) means all good things with respect
to software development, but with shortcomings (though few):

- A steeper learning curve compared to other mainstream languages, which is bad
  for hiring and team-building.

- The ecosystem is geared toward writing highly abstract code to solve whole
  categories of problems, which although is good for exploitative work based
  on well established disciplines, it can make exploratory work harder to carry
  out or even fail to get started (e.g. unable to come to agreement on which
  monad stack to start with). The overall ergonomics could possibly drop
  below average in attempts to write **Haskell** code merely solving specific
  problems, e.g. generating plenty varity of reporting sheets ever changing
  in weekly manners.

Your software development team should really be at solving programming problems.

While translating business goals into such programming problems is critical to
the success of your organization, it is usually not very clear within an
organisation who is in charge of that, as well as it is seldom realized the
essential difficulties in doing that. Disagreements on responsibility to tell
& expect reasonably, at times, lead to flame wars between e.g. Dev & Ops.

Fast iterations in development of computer powered systems don't
merely require programmers to write code fast, more importantly, ideas and
assessments should continuously get exchanged, explored and evaluated,
interactively by all teams including management, business development,
operation, product engineering, sales, marketing etc.

Where excessive use of jargons in software engineering or mathematics will
actually slow things down.

Some high level programming lanugages like [Python](https://python.org) have
verified some vocabularies and idioms with zen, that could be easier for
people with all kinds of backgrounds to efficiently talk about business logics
in form of source code of computer programs. While some low level programming
languages like [Go](https://golang.org) have demonstrated the success in
erasing certain quirks in programming tooling, e.g. it enables message passing
style concurrency / parallelism programming, while keeping the language and
dev/ops workflows simple and easy to handle.
All these programming languages impose a relative flat learning curve for
beginners, so people working on other disciplines of an organization would
feel welcomed to collaborate with development of the software systems driving
the business.

**Haskell** software usually bear high quality, one of the reasons must be
that it's harder to write working **Haskell** code before you come with a
sufficient understanding of the problem
[in mathematical ways](https://arxiv.org/abs/1904.07968).
But at times, that's not for a few individual persons or even a small number
of departments in an organization can solely come with understandings of the
business needs, organizational wide experiments are required to
facilitate and further optimize the business. Software systems can play a
critical role in such practices, while collaboration and iterations are
essential to its success.

In software engineering & development, there are purposeful choices of
different programming languages & frameworks, e.g.

- [Boring **Haskell**](https://www.snoyman.com/blog/2019/11/boring-haskell-manifesto)
  for mathematical minds
- **Rust**, **C/C++** for raw machine performance
- **LLVM**, **CUDA** for even accelerated machine performance
- **Python**, **Ruby** for human collaboration
- **Julia** for all above
- **Go** for integration of massive commponents
- **JavaScript** for Web technology based UI, and everything else with extra love
- And plenty of other options

Here is yet another set of offers:

- [HaskIt](https://github.com/e-wrks/haskit) (this package)

  Interactive workbench with easy yet powerful visualizations (powered by
  [BokehJS](https://docs.bokeh.org/en/latest/docs/dev_guide/bokehjs.html)
  ), for Data / Idea · Exploration / Exposition.

- [HasDim](https://github.com/e-wrks/hasdim)

  Do **Object Oriented**
  [Dimensional Modeling](https://en.wikipedia.org/wiki/Dimensional_modeling)
  of your data and processes, with **Vectorized High Performance Numeric
  Computing**, where [NVM](https://en.wikipedia.org/wiki/Non-volatile_memory)
  (e.g. disk) backed, [SIMD](https://en.wikipedia.org/wiki/SIMD) ready arrays
  are the norm.

- [Sedh](https://github.com/e-wrks/sedh) - Swarmed Edh

  Run jobs those need parallel computing power, with your own swarms of
  servers on premise, with possibily high-dimensional data efficiently shared
  as ND arrays.

  It is capable of scheduling **Pandas** / **Numpy** / **C/C++** based
  **Python** works, as well as [HasDim](https://github.com/e-wrks/hasdim) /
  **Haskell** based **Đ (Edh)** works, forming heterogeneous pipelines, where
  the same copies of
  [NVM](https://en.wikipedia.org/wiki/Non-volatile_memory)
  (e.g. disk) backed ND arrays are shared and pipelined amongst arbitrary
  components.

  Think of even easier parallelism in spirit of
  [MPI](https://www.mpi-forum.org),
  with the bonus that jobs are atomatically queued with respect to
  priority and headcount specification as submitted.

- [Nedh](https://github.com/e-wrks/nedh) - Networked Edh

  Yet another abstraction of networking for
  [IPC](https://en.wikipedia.org/wiki/Inter-process_communication)
  and
  [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call)
  over network.

  Think of something like **TCP** services with **UDP** discoveries, where
  [Head-of-Line blocking](https://en.wikipedia.org/wiki/Head-of-line_blocking)
  is resolved with arbitrary number of named, concurrent command channels, by
  each channel conveying its own stream of business instructions w/ data.

  You'll find [QUIC](https://en.wikipedia.org/wiki/QUIC)
  a.k.a. [HTTP/3](https://en.wikipedia.org/wiki/HTTP/3) be solving the same
  problems (with older network technologies) at transport layer, **Nedh** will
  naturally leverage that to be even more performant, when it comes mature.

- [EPM](https://github.com/e-wrks/epm) - Edh Package Manager

  Establish simple yet flexible WIP / Release Engineering workflows upon the
  **Đ (Edh)** / **Haskell** ecosystem.

- [Đ (Edh)](https://github.com/e-wrks/edh)

  An **Object** layer, or otherwise a _Parasitic Programming Language_, on top
  of **Haskell** ([GHC](https://haskell.org/ghc)), to a great extent, leveraging
  [Software Transactional Memory](http://hackage.haskell.org/package/stm)
  together with **GHC**'s _M:N_ concurrent / parallel scheduler. And it feels:

  - [familar to Python](https://github.com/e-wrks/edh/blob/0.3/Similarity/ToPython.md)

  - familar to **Go** in

    - goroutines (a.k.a. **Đ** threads atop **GHC** threads)
    - Object system

      An **Đ (Edh)** object of a class with inheritance hierarchy is actually
      a composition of multiple object instances, with 1:1 mapping of object to
      class in the inheritance structure. This is pretty much like the
      composition of **struct**s in **Go** (with pointer embedding especially).

      While embedding of (pointers to) **struct**s in **Go** enables method
      resolution automatically, it is almost the same (logical) machinery
      and semantics as in **Đ (Edh)**, for a class to `extends` other classes
      or an object to `extends` other objects.

      **Đ (Edh)** gives an extra in providing `that` reference for a super
      method to refer to the end object (thus to access it), while **Go**
      doesn't have an equivalent construct.

    - Sharing by Communicating
      - event sink as to channel
      - the same `<-` operator
    - IDE focus
      - Language Server
      - formatter
      - dedicated syntax themes
    - format on save by default

      **Đ (Edh)** has a canonical code formatter from the very beginning,
      a similar success as **Go** is that, the formatter enforces indentation
      rules aggressively, so while the language syntax remains brace based (
      thus the parser greatly simplified) most advantage of an identation based
      language is obtained, with even less indentation necessarities imposed.

    - other tooling concepts (e.g. `epm` to `go get`)

  - familar to **JavaScript** / **TypeScript** in

    - overall syntax
      - call operator - e.g. `f( g( x, y ) )`, where `new` keyword is optional
        for constructor call (for compatibility with **Python** etc.)
      - dot notation - e.g. `obj.attr`, `obj.attr = 3*7`
      - indexing - e.g. `obj[idx]`, `obj[idx] = 3*7`
      - etc. etc.
    - first class procedures (including `=>` with exactly same syntax and
      semantic)
    - dynamicity
    - Object system
      - prototype based (while being class based at the same time)
      - property by getter / setter methods
    - [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

      A more robust namespacing mechanism, for up-scaling of number of software
      component vendors

    - asynchronous constructs (including
      [for-await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of))
    - namespace construct (_TypeScript_)
    - modularity, dependency architecture with multiple versions of the same
      package composable (`edh_modules` to `node_modules`, `epm` to `npm`)
    - nice **REPL**

  - familar to **Haskell** in

    - first class procedures (functions)
    - low precedence call (function application) operator - `$` (pity to be
      left-associative by far), `&`
    - majority of value types are immutable
    - pattern matching (case-of with branches)
    - custom defined operators, with custom precedence
    - expression oriented (if-then-else etc.)
    - data classes to simulate Algebraic Data Type (though open thus incapable
      of exhaustiveness detection)
    - nice **REPL**

  It also comes with features on its own right:

  - Dynamic Scoped Effects
  - Compositional Classes
  - Event Sinks and Perceivers
  - Native Sandbox

  **Đ (Edh)** is seamlessly integrated with **Haskell**:

  - You can write **Haskell** functions[[1]](#f1) just taking arguments and returning[[2]](#f2)
    values of **Đ** types, then simply expose them to be callable from
    **Đ** scripting code

  - You can call **Đ** procedures directly from **Haskell** functions[[1]](#f1)

> [<b id="f1">1</b>]
> Access to the
> [STM](http://hackage.haskell.org/package/stm/docs/Control-Monad-STM.html#t:STM)
> or **IO** monad is mandated for **Haskell** functions to interact with **Đ**
> code

> [<b id="f2">2</b>]
> With (Edh Host Interface) in **Haskell**, returning from a host procedure
> ought in form of
> [CPS](https://en.wikibooks.org/wiki/Haskell/Continuation_passing_style)
