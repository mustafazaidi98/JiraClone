import React, { useState } from 'react';
import { Card, CardBody, Table, Button, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import './index.css'
const ProjectsTable = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Prometheus', owner: 'Mustafa', member: 5 },
    { id: 4, name: 'GoLang', owner: 'Google', member: 100 },
    { id: 5, name: 'OpenApi', owner: 'Elon', member: 10 },
  ]);

  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    owner: '',
    member: 0,
  });

  const handleInputChange = (event, field) => {
    setNewItem({ ...newItem, [field]: event.target.value });
  };

  const handleAddItem = () => {
    const newItemWithId = { ...newItem, id: items.length + 1 };
    setItems([...items, newItemWithId]);
    setNewItem({ id: '', name: '', owner: '', member: 0 });
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="w-75">
        <CardBody>
          <Table size="sm" striped bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Owner</th>
                <th>Member Count</th>
                <th>Dashboard Link</th>
                <th>Github Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ background: 'white' }}>
                  <th scope="row">{item.id}</th>
                  <td>
                    <Input type="text" value={item.name} readOnly />
                  </td>
                  <td>{item.owner}</td>
                  <td>{item.member}</td>
                  <td>
                    <Link to="/dashboard">Dashboard</Link>
                  </td>
                  <td>
                    <a href={`https://github.com/${item.id}`} target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </td>
                  <td>
                    <Button color="danger" onClick={() => setItems(items.filter((i) => i.id !== item.id))}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'white' }}>
                <td>
                  <Input type="text" value={newItem.id} onChange={(e) => handleInputChange(e, 'id')} />
                </td>
                <td>
                  <Input type="text" value={newItem.name} onChange={(e) => handleInputChange(e, 'name')} />
                </td>
                <td>
                  <Input type="text" value={newItem.owner} onChange={(e) => handleInputChange(e, 'owner')} />
                </td>
                <td>
                  <Input type="text" value={newItem.member} onChange={(e) => handleInputChange(e, 'member')} />
                </td>
                <td>
                  <Link to="/dashboard">Dashboard</Link>
                </td>
                <td>
                  <a href={`https://github.com/${newItem.id}`} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </td>
                <td>
                  <Button color="success" onClick={handleAddItem}>
                    Add
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProjectsTable;
