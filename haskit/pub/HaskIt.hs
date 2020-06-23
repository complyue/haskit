
module HaskIt where

import           Prelude
-- import           Debug.Trace

import           Control.Monad.Reader

import qualified Data.HashMap.Strict           as Map

import           Language.Edh.EHI


installHaskItBatteries :: EdhWorld -> IO ()
installHaskItBatteries !world = do

  void $ installEdhModule world "haskit/RT" $ \pgs exit -> do

    let moduScope = contextScope $ edh'context pgs
        modu      = thisObject moduScope

    !moduArts <-
      sequence
      $  [ (nm, ) <$> mkHostClass moduScope nm True hc | (nm, hc) <- [] ]
      ++ [ (nm, ) <$> mkHostProc moduScope mc nm hp args
         | (mc, nm, hp, args) <- []
         ]

    artsDict <- createEdhDict
      $ Map.fromList [ (EdhString k, v) | (k, v) <- moduArts ]
    updateEntityAttrs pgs (objEntity modu)
      $  [ (AttrByName k, v) | (k, v) <- moduArts ]
      ++ [(AttrByName "__exports__", artsDict)]

    exit

  void $ installEdhModule world "haskit/web/RT" $ \pgs exit -> do

    let moduScope = contextScope $ edh'context pgs
        modu      = thisObject moduScope

    !moduArts <-
      sequence
      $  [ (nm, ) <$> mkHostClass moduScope nm True hc | (nm, hc) <- [] ]
      ++ [ (nm, ) <$> mkHostProc moduScope mc nm hp args
         | (mc, nm, hp, args) <- []
         ]

    artsDict <- createEdhDict
      $ Map.fromList [ (EdhString k, v) | (k, v) <- moduArts ]
    updateEntityAttrs pgs (objEntity modu)
      $  [ (AttrByName k, v) | (k, v) <- moduArts ]
      ++ [(AttrByName "__exports__", artsDict)]

    exit
