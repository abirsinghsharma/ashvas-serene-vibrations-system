
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Phone, MessageSquare, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

const SOSContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      phone: '+1 (555) 123-4567',
      relationship: 'Doctor',
      isPrimary: true
    },
    {
      id: '2',
      name: 'John Smith',
      phone: '+1 (555) 987-6543',
      relationship: 'Family',
      isPrimary: false
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });

  const addContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      const contact: Contact = {
        id: Date.now().toString(),
        ...newContact,
        isPrimary: contacts.length === 0
      };
      
      setContacts([...contacts, contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
      
      toast({
        title: "Contact Added",
        description: `${contact.name} has been added to your SOS contacts`
      });
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Contact has been removed from your SOS list"
    });
  };

  const setPrimaryContact = (id: string) => {
    setContacts(contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    })));
    toast({
      title: "Primary Contact Updated",
      description: "Primary contact has been changed"
    });
  };

  const sendTestAlert = (contact: Contact) => {
    toast({
      title: "Test Alert Sent",
      description: `Test message sent to ${contact.name}`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-900 mb-2">SOS Contacts</h1>
          <p className="text-lg text-red-700">Manage your emergency contacts</p>
        </div>

        {/* Add New Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Add New Contact
            </CardTitle>
            <CardDescription>Add someone to your emergency contact list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                  id="relationship"
                  placeholder="e.g., Family, Doctor"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                />
              </div>
            </div>
            <Button onClick={addContact} className="mt-4">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </CardContent>
        </Card>

        {/* Contact List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <CardDescription>{contact.relationship}</CardDescription>
                  </div>
                  {contact.isPrimary && (
                    <Badge variant="default">Primary</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {contact.phone}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => sendTestAlert(contact)}>
                    <Phone className="mr-1 h-3 w-3" />
                    Call
                  </Button>
                  
                  <Button size="sm" variant="outline" onClick={() => sendTestAlert(contact)}>
                    <MessageSquare className="mr-1 h-3 w-3" />
                    Message
                  </Button>
                  
                  {!contact.isPrimary && (
                    <Button size="sm" variant="secondary" onClick={() => setPrimaryContact(contact.id)}>
                      Set Primary
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => removeContact(contact.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {contacts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No emergency contacts added yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add contacts above to enable SOS functionality.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SOSContacts;
