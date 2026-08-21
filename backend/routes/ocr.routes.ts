import { Router, Request, Response } from 'express';
import { extractBusinessCardOcr } from '../services/gemini.service';
import { crmService } from '../services/crm.service';

export const ocrRouter = Router();

// POST /api/ocr/scan-card - Extract structured JSON from card image
ocrRouter.post('/scan-card', async (req: Request, res: Response) => {
  try {
    const imageInput = req.body.imageBase64 || req.body.image;
    const mimeType = req.body.mimeType || 'image/jpeg';

    if (!imageInput) {
      return res.status(400).json({ error: 'imageBase64 or image string is required' });
    }

    const result = await extractBusinessCardOcr(imageInput, mimeType);
    return res.json(result);
  } catch (err: any) {
    console.error('[OCR Route Error]:', err);
    return res.status(500).json({
      error: 'Failed to process business card OCR',
      message: err.message || 'Unknown OCR error',
    });
  }
});

// POST /api/ocr/scan-and-save - Scan & immediately commit to Contact, Account, Opportunity, and Activities
ocrRouter.post('/scan-and-save', async (req: Request, res: Response) => {
  try {
    const { image, mimeType, cardData: incomingCardData, target = {}, contactIdToUpdate } = req.body;
    let cardData = incomingCardData;

    // If image provided without pre-extracted cardData, run OCR first
    if (!cardData && image) {
      cardData = await extractBusinessCardOcr(image, mimeType || 'image/jpeg');
    }

    if (!cardData) {
      return res.status(400).json({ error: 'Card data or image is required' });
    }

    const currentUsers = crmService.getUsers();
    const defaultUser = currentUsers[0] || { id: 'usr-1', name: 'Janaki Pawar' };
    const ownerId = target.ownerId || defaultUser.id;
    const ownerName = target.ownerName || defaultUser.name;

    let accountId = target.selectedExistingAccountId;
    let accountName = cardData.companyName || 'New Account';

    // Check or create account if requested
    if (!accountId && (target.createAccountIfNew || cardData.companyName)) {
      const existingAccounts = crmService.getAccounts();
      const existingMatch = existingAccounts.find(
        (a) => a.name.toLowerCase().trim() === (cardData.companyName || '').toLowerCase().trim()
      );

      if (existingMatch) {
        accountId = existingMatch.id;
        accountName = existingMatch.name;
      } else {
        const newAccount = crmService.createAccount({
          name: cardData.companyName || `${cardData.firstName}'s Enterprise`,
          ownerId,
          ownerName,
          type: 'Prospect',
          industry: 'Technology',
          ownership: 'Private',
          rating: 'Warm',
          annualRevenue: 3500000,
          employees: 75,
          businessSegment: 'Mid-Market',
          customerStatus: 'Pending',
          website: cardData.website || '',
          phone: cardData.phone || cardData.mobile || '',
          billingStreet: cardData.street || '',
          billingCity: cardData.city || '',
          billingState: cardData.state || '',
          billingPostalCode: cardData.postalCode || '',
          billingCountry: cardData.country || 'United States',
          leadSource: 'Visiting Card OCR',
          description: `Auto-created from visiting card OCR for ${cardData.firstName} ${cardData.lastName} (${cardData.jobTitle || 'Executive'}).`,
          createdBy: ownerName,
          modifiedBy: ownerName,
        });
        accountId = newAccount.id;
        accountName = newAccount.name;
      }
    }

    let contact;
    if (contactIdToUpdate) {
      // Update existing contact
      contact = crmService.updateContact(contactIdToUpdate, {
        salutation: cardData.salutation || 'Mr.',
        firstName: cardData.firstName,
        lastName: cardData.lastName,
        jobTitle: cardData.jobTitle,
        department: cardData.department,
        email: cardData.email,
        phone: cardData.phone,
        mobile: cardData.mobile,
        street: cardData.street,
        city: cardData.city,
        state: cardData.state,
        country: cardData.country,
        postalCode: cardData.postalCode,
        accountId: accountId || '',
        accountName: accountName,
        source: 'Visiting Card OCR',
        notes: cardData.notes || 'Updated via Visiting Card OCR Scanner',
        cardImageUrl: image?.startsWith('data:') || image?.startsWith('http') ? image : undefined,
      });
    } else {
      // Create new contact
      contact = crmService.createContact({
        salutation: cardData.salutation || 'Mr.',
        firstName: cardData.firstName || 'New',
        lastName: cardData.lastName || 'Contact',
        jobTitle: cardData.jobTitle || 'Executive',
        department: cardData.department || '',
        email: cardData.email || `${(cardData.firstName || 'contact').toLowerCase()}@${accountName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: cardData.phone || '',
        mobile: cardData.mobile || '',
        street: cardData.street || '',
        city: cardData.city || '',
        state: cardData.state || '',
        country: cardData.country || 'United States',
        postalCode: cardData.postalCode || '',
        accountId: accountId || '',
        accountName: accountName,
        preferredContactMethod: 'Email',
        source: 'Visiting Card OCR',
        ownerId,
        ownerName,
        notes: cardData.notes || 'Digitized and synchronized from physical business card.',
        cardImageUrl: image?.startsWith('data:') || image?.startsWith('http') ? image : undefined,
      });
    }

    // Create Opportunity if requested
    let opportunity = null;
    if (target.createOpportunity && contact) {
      const oppCloseDate = new Date();
      oppCloseDate.setDate(oppCloseDate.getDate() + 45);
      const stage = target.opportunityStage || 'Qualification';
      const amount = Number(target.opportunityAmount) || 50000;

      opportunity = crmService.createOpportunity({
        name: target.opportunityName || `${accountName} - Solution Onboarding`,
        accountId: accountId || '',
        accountName: accountName,
        primaryContactId: contact.id,
        primaryContactName: `${contact.firstName} ${contact.lastName}`,
        amount,
        stage,
        probability: stage === 'Qualification' ? 20 : stage === 'Needs Analysis' ? 40 : 60,
        expectedRevenue: amount * 0.4,
        expectedCloseDate: oppCloseDate.toISOString().split('T')[0],
        leadSource: 'Visiting Card OCR',
        status: 'Open',
        ownerId,
        ownerName,
        nextStep: 'Send introduction note with personalized solution capabilities',
        description: `Generated from visiting card capture for ${contact.firstName} ${contact.lastName} (${contact.jobTitle}).`,
      });
    }

    // Log Activity
    const activity = crmService.logActivity({
      type: 'OCR Card Scan',
      title: `Visiting Card OCR: ${contact?.firstName} ${contact?.lastName}`,
      description: `Digitized and updated contact details for ${contact?.jobTitle || 'Executive'} at ${accountName}.`,
      relatedToType: 'Contact',
      relatedToId: contact?.id,
      relatedToName: `${contact?.firstName} ${contact?.lastName}`,
      userId: ownerId,
      userName: ownerName,
    });

    return res.status(200).json({
      success: true,
      contact,
      account: accountId ? crmService.getAccountById(accountId) : null,
      opportunity,
      activity,
      cardData,
    });
  } catch (err: any) {
    console.error('[OCR Save Error]:', err);
    return res.status(500).json({
      error: 'Failed to save scanned card data',
      message: err.message || 'Unknown server error',
    });
  }
});

// POST /api/ocr/update-contact/:id - Update specific contact with scanned card payload
ocrRouter.post('/update-contact/:id', (req: Request, res: Response) => {
  try {
    const contactId = req.params.id;
    const { cardData, image } = req.body;

    if (!cardData) {
      return res.status(400).json({ error: 'cardData is required' });
    }

    const updated = crmService.updateContact(contactId, {
      salutation: cardData.salutation,
      firstName: cardData.firstName,
      lastName: cardData.lastName,
      jobTitle: cardData.jobTitle,
      department: cardData.department,
      email: cardData.email,
      phone: cardData.phone,
      mobile: cardData.mobile,
      street: cardData.street,
      city: cardData.city,
      state: cardData.state,
      country: cardData.country,
      postalCode: cardData.postalCode,
      source: 'Visiting Card OCR',
      cardImageUrl: image || undefined,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    crmService.logActivity({
      type: 'OCR Card Scan',
      title: `Card Re-scanned: ${updated.firstName} ${updated.lastName}`,
      description: `Updated contact coordinates and organization details from new visiting card scan.`,
      relatedToType: 'Contact',
      relatedToId: updated.id,
      relatedToName: `${updated.firstName} ${updated.lastName}`,
      userId: updated.ownerId,
      userName: updated.ownerName,
    });

    return res.json({ success: true, contact: updated });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update contact with card data', message: err.message });
  }
});

