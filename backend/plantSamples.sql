CREATE DATABASE PlantSamples;
USE PlantSamples

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: PlantSamples
--

-- 
-- Table structure for table `LiteralCharacterValues`
--

CREATE TABLE LiteralCharacterValues (
  PlantName varchar2(10) NOT NULL,
  Leaf_Color varchar2(10),
  Leaf_Shape varchar2(10),
  Stem_Color varchar2(10)
)