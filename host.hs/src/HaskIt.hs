module HaskIt where

-- import           Debug.Trace

import Control.Monad
import Language.Edh.EHI
import Prelude

installHaskItBatteries :: EdhWorld -> IO ()
installHaskItBatteries !world = do
  void $
    installModuleM world "haskit/RT" $ do
      !moduScope <- contextScope . edh'context <$> edhThreadState

      let !moduArts = []

      iopdUpdateEdh moduArts $ edh'scope'entity moduScope
      !esExps <- prepareExpStoreM (edh'scope'this moduScope)
      iopdUpdateEdh moduArts esExps
