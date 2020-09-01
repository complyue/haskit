
module HaskIt where

import           Prelude
-- import           Debug.Trace

import           Control.Monad.Reader

import           Language.Edh.EHI


installHaskItBatteries :: EdhWorld -> IO ()
installHaskItBatteries !world = do

  void $ installEdhModule world "haskit/RT" $ \ets exit -> do

    let moduScope = contextScope $ edh'context ets

    !moduArts <- sequence
      [ (nm, ) <$> mkHostProc moduScope mc nm hp args
      | (mc, nm, hp, args) <- []
      ]

    !artsDict <- EdhDict
      <$> createEdhDict [ (EdhString k, v) | (k, v) <- moduArts ]
    flip iopdUpdate (edh'scope'entity moduScope)
      $  [ (AttrByName k, v) | (k, v) <- moduArts ]
      ++ [(AttrByName "__exports__", artsDict)]

    exit

  void $ installEdhModule world "haskit/web/RT" $ \ets exit -> do

    let moduScope = contextScope $ edh'context ets

    !moduArts <- sequence
      [ (nm, ) <$> mkHostProc moduScope mc nm hp args
      | (mc, nm, hp, args) <- []
      ]

    artsDict <- EdhDict
      <$> createEdhDict [ (EdhString k, v) | (k, v) <- moduArts ]
    flip iopdUpdate (edh'scope'entity moduScope)
      $  [ (AttrByName k, v) | (k, v) <- moduArts ]
      ++ [(AttrByName "__exports__", artsDict)]

    exit
