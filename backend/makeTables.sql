CREATE DATABASE PlantSamples;
USE PlantSamples;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: PlantSamples
--

-- 
-- Table structure for table `LiteralCharacterValues`
--

CREATE TABLE LiteralCharacterValues (
  `PlantName` varchar(10),
  `Leaf_Color` varchar(10),
  `Leaf_Shape` varchar(10),
  `Stem_Color` varchar(10)
);

