module HaskIt where

-- import           Debug.Trace

import Control.Monad
import Language.Edh.CHI
import Prelude

installHaskItBatteries :: EdhWorld -> IO ()
installHaskItBatteries !world = do
  void $
    installEdhModule world "haskit/RT" $ \ !ets !exit -> do
      let !moduScope = contextScope $ edh'context ets

      let !moduArts = []

      iopdUpdate moduArts $ edh'scope'entity moduScope
      prepareExpStore ets (edh'scope'this moduScope) $ \ !esExps ->
        iopdUpdate moduArts esExps

      exit
