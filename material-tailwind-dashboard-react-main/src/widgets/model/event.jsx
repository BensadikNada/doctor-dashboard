import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import axiosClient from '@/hooks/axiosClient';

const EventModal = ({ isOpen, onClose, event ,fetchEvents }) => {
    const [eventName, setEventName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [usersLimit, setUsersLimit] = useState('');
    const [boa, setBoa] = useState('');
    const [bonus, setbonus] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
        if (event) {
            setEventName(event?.name);
            setStartDate();
            setEndDate();
            setUsersLimit(event?.max_users);
            setBoa(event?.boa);
            setbonus(event?.bonus);
            setImagePreviewUrl(event?.image); 
        }
    }, [event]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviewUrl(null);
        }
    };

    const handleSubmit = async () => {
        try {
          let imageUrl = event?.image;
          if (image) {
            const formData = new FormData();
            formData.append('file', image);
            const response = await axiosClient.post('image', formData);
            imageUrl = response.data;
          }
      
          // Start with mandatory fields
          const eventData = {
            name: eventName,
            max_users: usersLimit,
            boa: boa,
            bonus: bonus,
            image: imageUrl,
          };
      
          if (startDate) eventData.start_date = startDate;
          if (endDate) eventData.end_date = endDate;
      
          if (event) {
            const updateResponse = await axiosClient.put(`events/${event.id}`, eventData);
            console.log('Event updated:', updateResponse.data);
          } else {
            // Create new event
            const createResponse = await axiosClient.post('events', eventData);
            console.log('Event created:', createResponse.data);
          }
      
          fetchEvents(); // Assuming fetchEvents is a function that fetches updated events list
          onClose(); // Close the modal
        } catch (error) {
          console.error('Error saving event:', error);
        }
      };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>{event ? 'Edit Event' : 'Add Event'}</ModalHeader>
                <ModalBody>
                    {imagePreviewUrl && <img src={imagePreviewUrl} alt="Selected Image" className="max-w-full h-auto rounded-lg mt-4" />} {/* Display the selected image */}
                    <div>
                        <Input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <Input
                        label="Event Name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                    <div className="mb-4">
                        <label htmlFor="startDate">Start Date : {event?.start_date}</label>
                        <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                document.getElementById("endDate").min = e.target.value;
                            }}
                            className="w-full" 
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="endDate">End Date : {event?.end_date}</label>
                        <Input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full h-[56px]" // Make the End Date input full width and adjust the height as needed
                        />
                    </div>

                    <Input
                        type="number"
                        label="Users Limit"
                        value={usersLimit}
                        onChange={(e) => setUsersLimit(e.target.value)}
                    />
                    <Input
                        label="Boa"
                        type="number"
                        value={boa}
                        onChange={(e) => setBoa(e.target.value)}
                    />
                    <Input
                        label="bonus"
                        type="number"
                        value={bonus}
                        onChange={(e) => setbonus(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={onClose}>Cancel</Button>
                    <Button color="primary" onClick={handleSubmit}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EventModal;
