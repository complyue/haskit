module HaskIt where

-- import           Debug.Trace

import Control.Monad
import Language.Edh.EHI
import Prelude

installHaskItBatteries :: EdhWorld -> IO ()
installHaskItBatteries !world = runProgramM_ world $ do
  installModuleM_ "haskit/RT" $ do
    return ()
