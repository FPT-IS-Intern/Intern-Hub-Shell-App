import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonContainerComponent } from "../button-container/button-container.component";

@Component({
    selector: 'app-pop-up-confirm',
    standalone: true,
    imports: [CommonModule, ButtonContainerComponent],
    templateUrl: './pop-up-confirm.component.html',
    styleUrls: ['./pop-up-confirm.component.scss'],
})
export class PopUpConfirmComponent {

    @Input() imgUrl: string = '';
    @Input() title: string = '';
    @Input() content: string = '';
    @Input() colorButton: string = 'var(--brand-600)';

    @Output() confirmClick = new EventEmitter<void>();
    @Output() cancelClick = new EventEmitter<void>();

    onConfirm(): void {
        this.confirmClick.emit();
    }

    onCancel(): void {
        this.cancelClick.emit();
    }
}