import React, { useState } from 'react';
import './App.css';
import { Button, Col, Container, Dropdown, DropdownButton, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { registerPersonAndGetIBAN } from './service/api';

interface BillItem {
  selectedPeople: string[];
  price: number;
  iban: string
}
function App() {
  const [people, setPeople] = useState<string[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [billItems, setBillItems] = useState<BillItem[]>([]);




  // Function to add a person to the list
  const addPerson = () => {
    if (inputValue.trim() !== '' && !people.includes(inputValue)) {
      setPeople([...people, inputValue]);
      setInputValue(''); // Clear the input field after adding a person
    }
  };
  const handleSelectPerson = (person: string) => {
    if (selectedPeople.includes(person)) {
      // If the person is already selected, remove them from the selectedPeople array (deselect them)
      setSelectedPeople(selectedPeople.filter((p) => p !== person));
    } else {
      // If the person is not selected, add them to the selectedPeople array
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const addBillItem = async () => {
    if (selectedPeople.length === 0 || price === 0) {
      alert('Please select people and enter a valid price.');
      return;
    }

    const amountPerPerson = price / selectedPeople.length;
    const newBillItems: BillItem[] = [];

    for (const person of selectedPeople) {
      try {
        const iban: string = await registerPersonAndGetIBAN(person);
        console.log(`Person ${person} is registered width IBAN: ${iban}`);

        const newBillItem: BillItem = {
          selectedPeople: [person],
          price: amountPerPerson,
          iban: iban,
        };

        newBillItems.push(newBillItem);
      } catch (error: any) {
        console.error(`Failed to register for a person ${person}: ${error.message}`);
      }
    }
    setBillItems([...billItems, ...newBillItems]);
    setPrice(0);
    setSelectedPeople([]);
  };



  console.log(inputValue);

  return (
    <Container style={{ width: "800px" }}>
      <Row className='d-flex justify-content-center'>
        <Col md={12} >
          <h1 className='text-center mt-5'>PayBill</h1>
          <div className="mt-5">
            <label>Add person</label>
            <InputGroup className="mb-3">
              <Form.Control
                aria-label="Text input with dropdown button"
                placeholder="Enter a name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button onClick={addPerson}>ADD</Button>
            </InputGroup>
          </div>
        </Col>
      </Row>
      <Row className='d-flex justify-content-center mt-4'>
        <Col md={6}>
          <label>Price</label>
          <InputGroup className="mb-3">
            <Form.Control type='number' value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} aria-label="Text input with dropdown button" />
          </InputGroup>
        </Col>
        <Col md={6}>
          <label>People</label>
          <InputGroup className="mb-3">
            <Form.Control
              aria-label="Text input with dropdown button"
              value={selectedPeople.join(', ')}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <DropdownButton
              variant="outline-secondary"
              title="Select people"
              id="input-group-dropdown-1"
            >
              {people.map((person, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleSelectPerson(person)}
                >
                  {person}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </InputGroup>
        </Col>
      </Row>
      <Button onClick={addBillItem}>Add Item</Button>
      <Table striped bordered hover className='mt-5'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Pay</th>
            <th>Iban</th>
          </tr>
        </thead>
        <tbody>
          {billItems.map((item, index) => (
            <tr key={index}>
              <td>{item.selectedPeople.join(', ')}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.iban}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
