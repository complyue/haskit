module HaskIt.RT where

-- import           Debug.Trace

import Control.Monad
import Control.Monad.IO.Class
import qualified Data.ByteString as B
import Data.Maybe
import Data.Text (Text)
import qualified Data.Text as T
import qualified Data.Text.Encoding as TE
import Language.Edh.EHI
import System.Directory
import System.FilePath
import Prelude

readFileProc ::
  "name" !: Text ->
  "binary" ?: Bool ->
  "dir" ?: Text ->
  Edh EdhValue
readFileProc
  (mandatoryArg -> !name)
  (defaultArg False -> !bin)
  (optionalArg -> maybeDir) = liftIO $ do
    !canoPath <- canonicalizePath $ case maybeDir of
      Nothing -> T.unpack name
      Just !dir -> T.unpack dir </> T.unpack name
    !bytes <- B.readFile canoPath
    if bin
      then return $ EdhBlob bytes
      else return $ EdhString $ TE.decodeUtf8 bytes

writeFileProc ::
  "name" !: Text ->
  "data" !: EdhValue ->
  "dir" ?: Text ->
  Edh EdhValue
writeFileProc
  (mandatoryArg -> !name)
  (mandatoryArg -> !data_)
  (optionalArg -> maybeDir) = do
    !bytes <- case edhUltimate data_ of
      EdhBlob !bytes -> return bytes
      _ -> do
        !txt <- edhValueStrM data_
        return $ TE.encodeUtf8 txt

    liftIO $ do
      !canoPath <- canonicalizePath $ case maybeDir of
        Nothing -> T.unpack name
        Just !dir -> T.unpack dir </> T.unpack name
      B.writeFile canoPath bytes
      return nil
