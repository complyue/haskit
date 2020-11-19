module Main where

-- import           Debug.Trace

import Control.Concurrent (forkFinally)
import Control.Concurrent.STM (atomically, writeTBQueue)
import Control.Exception (SomeException)
import Control.Monad
import qualified Data.Text as T
import Language.Edh.EHI
  ( EdhConsole (consoleIO, consoleIOLoop),
    EdhConsoleIO (ConsoleOut, ConsoleShutdown),
    defaultEdhConsole,
    defaultEdhConsoleSettings,
  )
import Repl (edhProgLoop)
import System.Environment (getArgs)
import System.Exit (exitFailure)
import System.IO (hPutStrLn, stderr)
import Prelude

main :: IO ()
main =
  getArgs >>= \case
    [] -> runModu "haskit"
    [edhModu] -> runModu edhModu
    _ -> hPutStrLn stderr "Usage: hski [ <edh-module> ]" >> exitFailure
  where
    runModu :: FilePath -> IO ()
    runModu !moduSpec = do
      !console <- defaultEdhConsole defaultEdhConsoleSettings
      let !consoleOut = writeTBQueue (consoleIO console) . ConsoleOut

      void $
        forkFinally (edhProgLoop moduSpec console) $ \ !result -> do
          case result of
            Left (e :: SomeException) ->
              atomically $ consoleOut $ "💥 " <> T.pack (show e)
            Right _ -> pure ()
          -- shutdown console IO anyway
          atomically $ writeTBQueue (consoleIO console) ConsoleShutdown

      atomically $ do
        consoleOut ">> HaskIt Đ - Haskell Software, Fast Iterations <<\n"
        consoleOut
          "* Blank Screen Syndrome ? Take the Tour as your companion, checkout:\n"
        consoleOut "  https://github.com/e-wrks/haskit/tree/master/Tour\n"

      consoleIOLoop console
