-- Clear existing locations and add comprehensive Irish locations
DELETE FROM public.locations;

-- Insert comprehensive list of Irish counties and major cities
INSERT INTO public.locations (name, description) VALUES
-- Major Cities
('Dublin', 'Capital city and largest urban area'),
('Cork', 'Second largest city, located in Munster'),
('Limerick', 'Third largest city, on the River Shannon'),
('Galway', 'Cultural capital of the west coast'),
('Waterford', 'Oldest city in Ireland, in the southeast'),

-- Counties (all 32 counties of Ireland)
('Antrim', 'County in Northern Ireland'),
('Armagh', 'County in Northern Ireland'),
('Carlow', 'County in Leinster province'),
('Cavan', 'County in Ulster province'),
('Clare', 'County in Munster province'),
('Derry/Londonderry', 'County in Northern Ireland'),
('Donegal', 'Northernmost county in Ulster'),
('Down', 'County in Northern Ireland'),
('Fermanagh', 'County in Northern Ireland'),
('Kildare', 'County in Leinster province'),
('Kilkenny', 'Medieval county in Leinster'),
('Laois', 'County in Leinster province'),
('Leitrim', 'County in Connacht province'),
('Longford', 'County in Leinster province'),
('Louth', 'Smallest county in Leinster'),
('Mayo', 'Largest county in Connacht'),
('Meath', 'Royal county in Leinster'),
('Monaghan', 'County in Ulster province'),
('Offaly', 'County in Leinster province'),
('Roscommon', 'County in Connacht province'),
('Sligo', 'County in Connacht province'),
('Tipperary', 'Largest inland county'),
('Tyrone', 'Largest county in Northern Ireland'),
('Westmeath', 'County in Leinster province'),
('Wexford', 'Southeastern county in Leinster'),
('Wicklow', 'Garden county south of Dublin'),
('Kerry', 'Southwestern county in Munster'),

-- Major Towns
('Drogheda', 'Historic port town in Louth'),
('Dundalk', 'Town near Northern Ireland border'),
('Bray', 'Coastal town in Wicklow'),
('Navan', 'County town of Meath'),
('Ennis', 'County town of Clare'),
('Tralee', 'County town of Kerry'),
('Killarney', 'Tourist town in Kerry'),
('Letterkenny', 'Largest town in Donegal'),
('Athlone', 'Town on the River Shannon'),
('Mullingar', 'County town of Westmeath'),
('Tullamore', 'County town of Offaly'),
('Portlaoise', 'County town of Laois'),
('Naas', 'County town of Kildare'),
('Wexford Town', 'County town of Wexford'),
('Clonmel', 'Largest town in Tipperary'),
('Carlow Town', 'County town of Carlow');