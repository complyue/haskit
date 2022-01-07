module HaskIt where

-- import           Debug.Trace

import HaskIt.RT
import Language.Edh.EHI
import Prelude

installHaskItBatteries :: EdhWorld -> IO ()
installHaskItBatteries !world = runProgramM_ world $ do
  installModuleM_ "haskit/RT" $
    exportM_ $ do
      defEdhProc'_ EdhMethod "readFile" readFileProc
      defEdhProc'_ EdhMethod "writeFile" writeFileProc
