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
style concurrency/parallelism programming, while keeping the language and
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
of departments in an organization solely to come with understandings of the
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

Here is yet another offer:

- **HaskIt** (this package)

  Interactive workbench with easy yet powerful visualizations, for data/idea
  exploration.

- [HasDim](https://github.com/e-wrks/hasdim)

  Do **Object Oriented** dimensional modeling of your data and processes.

- [Sedh](https://github.com/e-wrks/sedh)

  Run jobs those need parallel computing power, with your own swarms of
  servers on premise, including those high-dimensional parts as efficiently
  shared ND arrays.

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
  on top of **Haskell** ([GHC](https://haskell.org/ghc)), leveraging
  [Software Transactional Memory](http://hackage.haskell.org/package/stm)
  to great extent.

  It feels familar to **Python**, **Go**, **JavaScript**, and in some way
  **Haskell** too, also comes with features on its own rights, including:

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
