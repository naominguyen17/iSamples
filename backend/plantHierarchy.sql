--
-- PlantHierarchy
--
CREATE DATABASE PlantHierarchy;
USE PlantHierarchy;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


--
-- Table structure for IDs
--
CREATE TABLE Plants (
  PlantID int NOT NULL PRIMARY KEY,
  PlantName varchar(10) UNIQUE
);
CREATE TABLE Parts (
  PartID int NOT NULL PRIMARY KEY,
  PartName varchar(10) UNIQUE
);
CREATE TABLE Characteristics(
  CharID int NOT NULL PRIMARY KEY,
  CharName varchar(10) UNIQUE
);
CREATE TABLE CharValues(
  ValueID int NOT NULL PRIMARY KEY,
  ValueName varchar(10) UNIQUE
); 

-- 
-- Main bindings here
--
CREATE TABLE CharValueBindings(
  PlantID int,
  PartID int,
  CharID int,
  ValueID int,
  PRIMARY KEY (PlantID, PartID, CharID),
  FOREIGN KEY (PlantID) REFERENCES Plants(PlantID),
  FOREIGN KEY (PartID)  REFERENCES Parts(PartID),
  FOREIGN KEY (CharID)  REFERENCES Characteristics(CharID),
  FOREIGN KEY (ValueID) REFERENCES CharValues(ValueID)
);

--
-- Helpful views
--

--
-- BindingList
--
-- View of CharValueBindings
-- Instead of ID, names
CREATE VIEW BindingList AS -- it is CharValueBindings
SELECT pl.PlantName, pr.PartName, c.CharName, v.ValueName -- but instead of IDs, they're all names
FROM CharValueBindings as cvb, Plants as pl, Parts as pr, 
Characteristics as c, CharValues as v
WHERE cvb.PlantID=pl.PlantID AND cvb.PartID=pr.PartID
 AND cvb.CharID=c.CharID AND cvb.ValueID=v.ValueID;

--
-- PlantCharValues
--
-- Similar copy to in plantSamples
CREATE VIEW PlantCharValues AS
SELECT PlantName, CONCAT(PartName, '_', CharName) as PartChar, ValueName FROM BindingList
ORDER BY PlantName;