# Main Components Guide

Hướng dẫn sử dụng các component trong thư mục `src/libs/main-components`.

---

## 1. Button Container

**Selector:** `app-button-container`

### Import

```typescript
import { ButtonContainerComponent } from '../../main-components/button-container/button-container.component';

@Component({
  imports: [ButtonContainerComponent],
  // ...
})
```

### Inputs

| Input             | Type                           | Default              | Mô tả              |
| ----------------- | ------------------------------ | -------------------- | ------------------ |
| `size`            | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'`               | Kích thước button  |
| `content`         | `string`                       | `''`                 | Nội dung text      |
| `leftIcon`        | `string`                       | -                    | Icon bên trái      |
| `rightIcon`       | `string`                       | -                    | Icon bên phải      |
| `fontSize`        | `string`                       | auto                 | Override font-size |
| `color`           | `string`                       | `var(--brand-100)`   | Màu text           |
| `backgroundColor` | `string`                       | `var(--utility-900)` | Màu nền            |
| `borderColor`     | `string`                       | `var(--brand-100)`   | Màu viền           |

### Outputs

| Output        | Type                 | Mô tả                 |
| ------------- | -------------------- | --------------------- |
| `buttonClick` | `EventEmitter<void>` | Emit khi click button |

### Size Config

| Size | Min Width | Min Height | Icon Size |
| ---- | --------- | ---------- | --------- |
| `xs` | 47px      | 24px       | 14px      |
| `sm` | 96px      | 28px       | 16px      |
| `md` | 116px     | 36px       | 20px      |
| `lg` | 120px     | 44px       | 20px      |

### Ví dụ

```html
<!-- Basic -->
<app-button-container size="md" content="Click me" (buttonClick)="onButtonClick()">
</app-button-container>

<!-- With icons -->
<app-button-container
  size="lg"
  content="Submit"
  leftIcon="◀"
  rightIcon="▶"
  backgroundColor="var(--brand-600)"
  color="#fff"
  (buttonClick)="onSubmit()"
>
</app-button-container>
```

---

## 2. PopUp Confirm

**Selector:** `app-pop-up-confirm`

### Import

```typescript
import { PopUpConfirmComponent } from '../../main-components/pop-up-confirm/pop-up-confirm.component';

@Component({
  imports: [PopUpConfirmComponent],
  // ...
})
```

### Inputs

| Input         | Type     | Default            | Mô tả            |
| ------------- | -------- | ------------------ | ---------------- |
| `imgUrl`      | `string` | `''`               | URL hình ảnh     |
| `title`       | `string` | `''`               | Tiêu đề popup    |
| `content`     | `string` | `''`               | Nội dung mô tả   |
| `colorButton` | `string` | `var(--brand-600)` | Màu nút "Đồng Ý" |

### Outputs

| Output         | Type                 | Mô tả                     |
| -------------- | -------------------- | ------------------------- |
| `confirmClick` | `EventEmitter<void>` | Emit khi click "Đồng Ý"   |
| `cancelClick`  | `EventEmitter<void>` | Emit khi click "Quay Lại" |

### Ví dụ

```html
<!-- Component -->
<app-pop-up-confirm
  *ngIf="showPopup"
  imgUrl="/icon.svg"
  title="Xác nhận"
  content="Bạn có chắc chắn?"
  colorButton="var(--brand-600)"
  (confirmClick)="onConfirm()"
  (cancelClick)="onCancel()"
>
</app-pop-up-confirm>
```

```typescript
// TypeScript
showPopup = false;

openPopup() {
  this.showPopup = true;
}

onConfirm() {
  console.log('Confirmed!');
  this.showPopup = false;
}

onCancel() {
  console.log('Cancelled!');
  this.showPopup = false;
}
```

---

## 3. Header

**Selector:** `app-header-component`

### Import

```typescript
import { HeaderComponent } from '../../main-components/header/header.component';

@Component({
  imports: [HeaderComponent],
  // ...
})
```

### Ví dụ

```html
<app-header-component></app-header-component>
```

---

## 4. Sidebar

**Selector:** `app-sidebar`

### Import

```typescript
import { SidebarComponent } from '../../main-components/sidebar/sidebar.component';

@Component({
  imports: [SidebarComponent],
  // ...
})
```

### Ví dụ

```html
<app-sidebar></app-sidebar>
```

---

## CSS Variables từ System Design

Các biến CSS có thể sử dụng:

### Colors

- `var(--brand-600)`, `var(--brand-100)`, ...
- `var(--primary-600)`, `var(--primary-100)`, ...
- `var(--neutral-color-500)`, `var(--neutral-color-875)`, ...

### Font Sizes

- `var(--font-xs)` = 12px
- `var(--font-sm)` = 14px

### Radius

- `var(--radius-md)` = 8px
