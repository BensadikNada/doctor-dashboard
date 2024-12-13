import React, { useState } from 'react';
import { Dialog, DialogHeader,TabsHeader,TabPanel, TabsBody,DialogBody, DialogFooter, Button, Tabs, Tab } from '@material-tailwind/react';
import Users from '../components/Patient';
import { Consultation } from '../components/Consultation';
import RendezVous from '../components/rendezVous';
import Bilan from '../components/Bilan';
import Ordonances from '../components/Ordonances';
import Radio from '../components/Radio';
import Paiment from '../components/Paiment';


export function PatientInfoDialog({ isOpen, onClose, patient }) {
  const [selectedTab, setSelectedTab] = useState("Information"); 

  const data = [
    {
      label: "Information",
      value: "Information",
      component: <Users patient={patient}/>,
    },
    {
      label: "Consultation",
      value: "Consultation",
      component: <Consultation patient={patient}/>,
    },
    {
      label: "Rendez-vous",
      value: "Rendez-vous",
      component: <RendezVous patient={patient}/>,
    },
    {
      label: "Bilan",
      value: "Bilan",
      component: <Bilan patient={patient}/>,
    },
    {
      label: "Radiologies",
      value: "Radiologie",
      component: <Radio patient={patient}/>,
    },
    {
      label: "Ordonances",
      value: "Ordonance",
      component: <Ordonances patient={patient}/>,
    },
    {
      label: "Paiment",
      value: "Paiment",
      component: <Paiment patient={patient}/>,
    },
  ];
  
  
  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size={selectedTab =='Information' ? 'lg' :"xxl" }
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className='flex flex-col'
    >
      <DialogHeader>
        <div className='w-full flex justify-between items-center'>
           <p>Information de {patient?.nom} {patient?.prenom}</p>
           <img src={patient?.image} alt={patient?.nom} className='h-12 w-12 rounded-full' />
        </div> 
      </DialogHeader>
      <DialogBody className='flex-1'>
      <Tabs value={selectedTab} >
            <TabsHeader className={`md:w-[600px] lg:w-[1000px] flex-col lg:flex-row  `}>
                {data.map(({ label, value }) => (
                    <Tab key={value} value={value} onClick={() => setSelectedTab(value)}>
                        {label}
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
                {data.map(({ value, component }) => (
                    <TabPanel key={value} value={value}>
                        {selectedTab === value && component}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose}>Cancel</Button>
      </DialogFooter>
    </Dialog>
  );
}