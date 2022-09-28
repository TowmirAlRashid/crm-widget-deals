import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const ZOHO = window.ZOHO;

function App() {
  const [initialized, setInitialized] = useState(false)
  const [entity, setEntity] = useState()
  const [entityId, setEntityId] = useState()
  const [contacts, setContacts] = useState([])

  const [record, setRecord] = useState({
    Contact_Name: '',
  });

  useEffect(() => {
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      setEntity(data?.Entity);
      setEntityId(data?.EntityId?.[0])
    });

    ZOHO.embeddedApp.init().then(() => setInitialized(true));
  }, [])

  useEffect(() => {
    if (entity && entityId) {
      ZOHO.CRM.API.getRelatedRecords({
        Entity: entity,
        RecordID: entityId,
        RelatedList: "Contacts",
        page: 1,
        per_page: 200,
      }).then(function (data) {
        console.log(data?.data?.map((contact) => contact?.Full_Name));
        setContacts(data?.data?.map((contact) => contact?.Full_Name));
      });
    }
  }, [initialized, entity, entityId])

  return (
    <div>
      <Box
        component="form"
        noValidate
        sx={{
          width: "80%",
          m: "2rem auto 1.5rem",
        }}
      >
        <Typography sx={{ textAlign: "center", mb: "2rem" }} variant="h6">
          Create a new Deal?
        </Typography>

        <label htmlFor="contacts" style={{ marginBottom: '0.8rem'}}>Select Contact</label>
        <Autocomplete
          disablePortal
          id="contacts"
          options={contacts}
          fullWidth
          sx={{ mt: '0.8rem' }}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </div>
  );
}

export default App;
