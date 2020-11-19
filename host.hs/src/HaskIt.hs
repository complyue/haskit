module HaskIt where

-- import           Debug.Trace

import Control.Monad
import Language.Edh.EHI
import Prelude

installHaskItBatteries :: EdhWorld -> IO ()
installHaskItBatteries !world = do
  void $
    installEdhModule world "haskit/RT" $ \ !ets !exit -> do
      let !moduScope = contextScope $ edh'context ets

      !moduArts <-
        sequence $
          [(nm,) <$> mkHostProc moduScope mc nm hp | (mc, nm, hp) <- []]
            ++ [ (nm,) <$> mkHostProperty moduScope nm getter setter
                 | (nm, getter, setter) <- []
               ]

      !artsDict <-
        EdhDict
          <$> createEdhDict [(EdhString k, v) | (k, v) <- moduArts]
      flip iopdUpdate (edh'scope'entity moduScope) $
        [(AttrByName k, v) | (k, v) <- moduArts]
          ++ [(AttrByName "__exports__", artsDict)]

      exit

  void $
    installEdhModule world "haskit/web/RT" $ \ !ets !exit -> do
      let !moduScope = contextScope $ edh'context ets

      !moduArts <-
        sequence $
          [(nm,) <$> mkHostProc moduScope mc nm hp | (mc, nm, hp) <- []]
            ++ [ (nm,) <$> mkHostProperty moduScope nm getter setter
                 | (nm, getter, setter) <- []
               ]

      !artsDict <-
        EdhDict
          <$> createEdhDict [(EdhString k, v) | (k, v) <- moduArts]
      flip iopdUpdate (edh'scope'entity moduScope) $
        [(AttrByName k, v) | (k, v) <- moduArts]
          ++ [(AttrByName "__exports__", artsDict)]

      exit
