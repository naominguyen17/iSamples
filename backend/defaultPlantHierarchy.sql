USE PlantHierarchy;
--
-- Records
--
INSERT INTO Plants(PlantID, PlantName)
VALUES(0, "PlantA"),
      (1, "PlantB");

INSERT INTO Parts(PartID, PartName)
VALUES(0, "Leaf"),
      (1, "Stem");

INSERT INTO Characteristics(CharID, CharName)
VALUES (0, "Color"),
       (1, "Shape");

INSERT INTO CharValues(ValueID, ValueName)
VALUES(0, "Green"),
      (1, "Red"),
      (2, "Toothed");

--
-- Whole database
--
INSERT INTO CharValueBindings(PlantID, PartID, CharID, ValueID)
VALUES(0,0,0,0), -- A: Leaf_Color: Green
      (0,0,1,2), -- A: Leaf_Shape: Toothed
      (0,1,0,0), -- A: Stem_Color: Green
      (1,0,0,1); -- B: Leaf_Color: Red

