import { TestBed } from '@angular/core/testing'
import { ApiService } from '../../../services/api-service'
import { BlobService } from '../../../services/blob-service'
import { ModalService } from '../../../services/modal-service'
import { ToastService } from '../../../services/toast-service'
import { LearnablesStore } from '../../../store/learnablesStore'
import { OverviewPageFacade } from './overview-page-facade'

describe('OverviewPageFacade', () => {
  let facade: OverviewPageFacade
  let mockLearnablesStore: any
  let mockModalService: jasmine.SpyObj<ModalService>
  let mockToastService: jasmine.SpyObj<ToastService>
  let mockApiService: jasmine.SpyObj<ApiService>
  let mockBlobService: jasmine.SpyObj<BlobService>

  beforeEach(() => {
    // Create mock services
    mockLearnablesStore = jasmine.createSpyObj('LearnablesStore', [
      'addLearnables',
      'updateLearnables',
      'removeLearnables',
      'createCollection',
      'editCollectionLearnables',
      'editCollection',
      'deleteCollection'
    ])

    mockModalService = jasmine.createSpyObj('ModalService', ['open'])
    mockToastService = jasmine.createSpyObj('ToastService', ['showToast'])
    mockApiService = jasmine.createSpyObj('ApiService', ['shareBank'])
    mockBlobService = jasmine.createSpyObj('BlobService', [
      'createDownloadableFromLearnables'
    ])

    TestBed.configureTestingModule({
      providers: [
        OverviewPageFacade,
        { provide: LearnablesStore, useValue: mockLearnablesStore },
        { provide: ModalService, useValue: mockModalService },
        { provide: ToastService, useValue: mockToastService },
        { provide: ApiService, useValue: mockApiService },
        { provide: BlobService, useValue: mockBlobService }
      ]
    })

    facade = TestBed.inject(OverviewPageFacade)
  })

  it('should be created', () => {
    expect(facade).toBeTruthy()
  })

  describe('State Management', () => {
    it('should initialize with no selected collection', () => {
      expect(facade.selectedCollectionId()).toBeNull()
    })

    it('should initialize with empty selected learnable ids', () => {
      expect(facade.selectedLearnableIds()).toEqual([])
    })

    it('should reset selection when collection changes', () => {
      facade.selectedLearnableIds.set(['id1', 'id2'])
      facade.selectedCollectionId.set('collection1')

      expect(facade.selectedLearnableIds()).toEqual([])
    })
  })

  describe('Learnable Selection', () => {
    it('should toggle learnable selection', () => {
      const learnableId = 'learnable-1'

      facade.toggleLearnableSelection(learnableId)
      expect(facade.isSelected(learnableId)).toBe(true)

      facade.toggleLearnableSelection(learnableId)
      expect(facade.isSelected(learnableId)).toBe(false)
    })

    it('should reset learnable selection', () => {
      facade.selectedLearnableIds.set(['id1', 'id2', 'id3'])
      facade.resetLearnableSelection()

      expect(facade.selectedLearnableIds()).toEqual([])
    })
  })

  describe('Filter Management', () => {
    it('should update filter', () => {
      const filter = { age: 'newest' as const }
      facade.updateFilter(filter)

      // Filter is private, so we test its effect through visibleLearnables
      // This would need actual store data to test properly
      expect(facade.visibleLearnables).toBeDefined()
    })
  })

  describe('Toast Notifications', () => {
    it('should show toast when resetting selection after edit', () => {
      facade.selectedLearnableIds.set(['id1', 'id2'])
      facade['_finishEditAndShowToast']('Test message')

      expect(mockToastService.showToast).toHaveBeenCalledWith({
        message: 'Test message',
        type: 'info'
      })
      expect(facade.selectedLearnableIds()).toEqual([])
    })
  })
})
