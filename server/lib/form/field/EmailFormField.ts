import {AbstractFormField} from "~/server/lib/form/field/AbstractFormField";
import {ValidationUtil} from "~/server/lib/util/ValidationUtil";
import {IMaxLengthFormField} from "~/server/lib/form/field/IMaxLengthFormField";
import {IClientFormField} from "~/server/lib/form/field/IClientFormField";

interface IClientEmailFormField extends IClientFormField<string> {
    
    maxLength: number;
    validation: RegExp
    
}

export class EmailFormField extends AbstractFormField<string, string> implements IMaxLengthFormField {
    
    constructor(id : string, emailAddress : string) {
        super(id, emailAddress);
    }
    
    validate() {
        if(!super.validate()) {
            return false;
        }
    
        if(!this.validateMaxLength()) {
            return this.setValidationError("ERR_FORM_VALIDATION_EMAIL_TOO_LONG");
        }
        
        if(!ValidationUtil.isEmailAddress(this.getValue())) {
            return this.setValidationError("ERR_FORM_VALIDATION_EMAIL_INVALID");
        }
        
        return true;
    }
    
    //<editor-fold desc="Implementation of IMaxLengthFormField">
    maxLength: number = null;
    
    getMaxLength() {
        return this.maxLength;
    }
    
    setMaxLength(length: number) {
        this.maxLength = length;
        
        return this;
    }
    
    validateMaxLength() {
        return this.maxLength === null || this.getValue().length <= this.getMaxLength();
    }
    //</editor-fold>
    
    getSafeValue(): string {
        return this.getValue();
    }
    
    getClientField(): IClientEmailFormField {
        return {
            id: this.getId(),
            type: "email",
            value: this.getSafeValue(),
            error: this.getValidationError(),
            maxLength: this.getMaxLength(),
            validation: ValidationUtil.getEmailValidator()
        };
    }
    
}