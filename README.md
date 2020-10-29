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
  out or even get started. The overall ergonomics would probably drop below
  average in attempts to write **Haskell** code only solving specific problems,
  e.g. generating plenty varity of reporting sheets ever changing in weekly
  manners.

Your software development team should really be solving programming problems,
while translating business goals into such programming problems is critical to
the success of your organization. It is usually not very clear within an
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
  Computing**, as [NVM](https://en.wikipedia.org/wiki/Non-volatile_memory)
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
  (e.g. disk) backed ND Arrays are shared and pipelined amongst arbitrary
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
  is resolved by arbitrary number of named, concurrent command channels, with
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

  - familar to **Python** in

    - Zen
    - overall syntax
      - call operator - e.g. `f( g( x, y ) )`, where `new` keyword is not
        needed for constructor call (but can be there for compatibility with
        **JavaScript** etc.)
      - dot notation - e.g. `obj.attr`, `obj.attr = 3*7`
      - indexing - e.g. `obj[idx]`, `obj[idx] = 3*7`
      - etc. etc.
    - first class procedures (including `=>` to `lambda` functions)
    - dynamicity
    - Object system

      - class based (while being prototype based at the same time)
      - multiple inheritance with **C3 linearization**
      - property by getter / setter methods
      - magic methods

      Class definition syntax and semantics in **Đ (Edh)** are vastly the
      same as in **Python**, e.g. the magic methods `__init__()`, `__str__()`,
      `__repr__()` have exactly the same semantics.

      While in **Python** you can rely on the language to translate `obj + val`
      to `obj.__add__(val)`, `val + obj` to `obj.__radd__(val)`, in **Đ (Edh)**
      the same surface syntax is translated to `obj.(+)(val)` and
      `obj.(+@)(val)` respectively. More examples:

      | Surface Syntax   | Python Translation          | Đ (Edh) Translation   |
      | ---------------- | --------------------------- | --------------------- |
      | `obj - val`      | `obj.__sub__(val)`          | `obj.(-)(val)`        |
      | `val - obj`      | `obj.__rsub__(val)`         | `obj.(-@)(val)`       |
      | `obj(x, y)`      | `obj.__call__(x, y)`        | `obj.__call__(x, y)`  |
      | `obj[idx]`       | `obj.__getitem__(idx)`      | `obj.([])(idx)`       |
      | `obj[idx] = val` | `obj.__setitem__(idx, val)` | `obj.([=])(idx, val)` |
      | `obj += val`     | `obj.__iadd__(val)`         | `obj.(+=)(val)`       |

      While you are limited to operators defined by the language as with  
      **Python**, all operators in **Đ (Edh)** are custom operators - some come
      with the default batteries, while it is open for all **Đ** programmers to
      define arbitrary operators as they see fit, then all operators get  
      automatically translated to magic methods for objects, making it vastly
      more extensible than **Python**.

    - conditional operator implementation

      **Đ (Edh)** supports the idiom of `return`ing `default <expr>` from an
      operator's implementing method (whether standalone or being some object's
      magic method), this is at par to **Python**'s
      [NotImplemented](https://docs.python.org/3/library/constants.html#NotImplemented)
      semantic, but it is more powerful in that instead of refusal in entirety,
      an inferior implementation can be supplied as the `<expr>` as well.
      `default nil` carries the same semantic as
      [NotImplemented](https://docs.python.org/3/library/constants.html#NotImplemented)
      , while there is a literal constant `NA` (stands for **Not/Applicable**)
      in **Đ (Edh)** being equivalent to `default nil`.

      A standalone operator procedure in **Đ (Edh)** (which **Python** doesn't
      have an equivelant) assumes higher priority than a magic method from any
      of the operand objects, it is vital for such standalone operators to
      `return default <formulae>` in order for objects to be able to override
      it with magic methods for more meaningful, superior implementations.

      And a subclass' magic method assumes higher priority than those from some
      super classes, so a class can `return` `default <expr>` to prefer super
      implementation while providing a fail-safe implementation. This is more
      useful when multiple inheritance is in consideration, and as the choice
      being dynamically decidable.

      E.g. the `++` and `+` operator come with default batteries are meant
      to do string concatenation (as for non-numeric values in case of `+`
      operator) after both operands converted with `str()`, but obviously the
      `Vector` class wants to override them to return vectorized result with
      element-wise operations applied.

      And **HasDim** defined `Column` class which is for array objects similar
      to 1d **Numpy** `ndarray`, it performs similar overrides to do
      vectorized High Performance Numeric Computation against **SIMD** ready
      data stored for a column object.

    - decorators (`$` is used to express decorators in Edh, while it is
      actually more general than **Python** decorator syntax, `property$`
      and `setter$` e.g. are there for exactly the same semantics as
      `@property` and `@setter` in **Python**)
    - data classes ([PEP557](https://www.python.org/dev/peps/pep-0557))
    - asynchronous constructs (
      [PEP492](https://www.python.org/dev/peps/pep-0492)
      [PEP525](https://www.python.org/dev/peps/pep-0525)
      [PEP530](https://www.python.org/dev/peps/pep-0530)
      )
    - seamless integration with the host language / runtime (**Haskell** as for
      **Edh** to **C/C++** as for **Python**)
    - namespace modules and entry modules (`__init__.edh` to `__init__.py`,
      `__main__.edh` to `__main__.py`)
    - reflective meta data (`__name__` `__file__` etc.)
    - **Sphinx** based auto documentation
    - nice **REPL**

  - familar to **Go** in

    - goroutines (a.k.a. **Edh** threads atop **GHC** threads)
    - Compositional Classes (as to composition of **struct**s, with embedding
      enabled method resolution)
    - Sharing by Communicating (event sink as to channel)
    - IDE focus (Language Server, formatter, dedicated syntax themes)
    - format on save by default, with a canonical code formatter -- parser get
      greatly simplified, as the formatter enforces indentation rules, the
      syntax remains brace based, with less indentation necessarities imposed
    - other tooling concepts (e.g. `epm` as to `go get`)

  - familar to **JavaScript** / **TypeScript** in

    - overall syntax
      - call operator - e.g. `f( g( x, y ) )`, where `new` keyword is optional
        for constructor call (for compatibility with **Python** etc.)
      - dot notation - e.g. `obj.attr`, `obj.attr = 3*7`
      - indexing - e.g. `obj[idx]`, `obj[idx] = 3*7`
      - etc. etc.
    - first class procedures (including `=>` arrows functions)
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
    - low precedence call (function application) operator - `$`, `&`
    - majority of value types are immutable
    - pattern matching (case-of with branches)
    - custom defined operators (thus magic methods for objects), with custom
      precedence
    - expression oriented (if-then-else etc.)
    - Algebraic Data Type (simulated with data classes)
    - nice **REPL**

  It also comes with features on its own rights:

  - Dynamic Scoped Effects
  - Compositional Classes
  - Event Sinks and Perceivers

  **Đ (Edh)** is seamlessly integrated with **Haskell**:

  - You can write **Haskell** functions[[1]](#f1) just taking arguments and returning[[2]](#f2)
    values of **Đ** types, then simply expose them to be callable by
    **Đ** scripting code

  - You can call **Đ** procedures directly from **Haskell** functions[[1]](#f1)

> [<b id="f1">1</b>]
> Access to the
> [STM](http://hackage.haskell.org/package/stm/docs/Control-Monad-STM.html#t:STM)
> or **IO** monad is mandated for **Haskell** functions to interact with **Đ**
> code

> [<b id="f2">2</b>]
> With (Edh Host Interface) in **Haskell**, returning from a host procedure is
> in form of
> [CPS](https://en.wikibooks.org/wiki/Haskell/Continuation_passing_style)
